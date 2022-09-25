## Question Service

The service is linked to `backend` and utilises the following:

1. PlanetScale -- Hosted MySQL database (also used by `User Service`)
2. Prisma -- ORM for PlanetScale
3. Firebase/GCP Cloud Functions
   * HTTP-trigger to manually seed,
   * Event-triggered (PubSub + Cloud Scheduler) to simulate cron job.

### Functional Requirements

1. Matched users should be served the same question based on their matching criteria.
2. System should be able to get questions by difficulty and topic.
3. Users should be able to see the latest details of the question at a glance.

### Non-functional Requirements

1. Questions, summary and details, should be served to users within 3 seconds.

### Detailed Design

#### Addressing FR and NFR

1. Store the question details in a database -- resolve availabilty issues.
   * This is to prevent the service from being strongly coupled to (depend on) Leetcode's endpoint.
   * If Leetcode becomes unavailable -- goes down, blocks public access to data -- or changes the endpoint, the service would not be able to serve the users anything.
   * The only time the service would not be able to serve questions is if the database goes down.
     * *Nice-to-have*: ~~Automate backups in the event the database crashes and loses all data.~~ Handled by PlanetScale, free daily backup. :+1:
2. Users will be served updated data as the database gets updated every hour and checks for 

#### Potential Issues

1. Issue: Exceeding runtime of Cloud Function
   * Cloud Functions runtime is limited to 540 seconds ([see here](https://cloud.google.com/functions/quotas#time_limits)), and Prisma does not support `createMany` **and** establish relations, this has to be done one-by-one.
   * There is no known Leetcode GraphQL endpoint that returns the `QuestionContent` of all questions and it has to be done manually.
   * With ~2000 free Leetcode questions and querying each content takes ~300ms, querying all the questions would take ~600 seconds, prior to accounting for updating `QuestionSummary`, retries and writing to the database and would overrun the limitation of Cloud Function.

> To resolve this:
>
> * Separate updating the `QuestionSummary` and `QuestionContent`, and execute them sequentially in that order (content relies on summary).

2. Issue: Leetcode rate-limiting queries and potential network I/O errors
   * As mentioned in the point above, at worst, the service would need to query all question contents. This does happen when the database is fresh or if LeetCode adds a lot of new questions at once.

> To resolve this:
>
> * Process LC queries by chunks rather than sending all the requests at once (`Promise.all()`)
>   * Seeding the database: This does not fully resolve the issue but yields better results (more HTTP status 200)
>   * Updating the database: This should not prove to be an issue as it is unlikely that LC adds >10 questions in a day.
>
> The following were implemented but only (2) is deployed:
>
> 1. Creating a HTTP-triggered function and repeat it until there are no leftovers, or
> 2. Increase the frequency of the event-triggered function.
>
> The service implements both to seed and update by the hour every hour to update the summary values, daily quetion and resolve and leftover missing content, if any.

#### Schemas

Updated as of: 25th Septemeber 2022

This is based of what LeetCode returns, for the actual schema that was applied, refer to `prisma/schema.prisma` which also covers the relations such as the one-to-many relation that was mentioned in [the first point](#potential-issues) of the previous section.

##### QuestionSummary

| Column Name  | Data Type   | Description                                   |
| ------------ | ----------- | --------------------------------------------- |
| `acRate`     | `number`    | Solution acceptance rate (%)                  |
| `difficulty` | `string`    | Difficulty level of the question              |
| `paidOnly`   | `boolean`   | Is the question only available to paid users? |
| `title`      | `string`    | Question title                                |
| `titleSlug`  | `string`    | Slug associated to question                   |
| `topicTags`  | `string[]`  | Topics that are associated to the question    |
| `createdAt`  | `timestamp` | When the question was seeded                  |
| `updatedAt`  | `timestamp` | When the question was last updated            |

##### QuestionContent

| Column Name      | Data Type   | Description                                        |
| ---------------- | ----------- | -------------------------------------------------- |
| `content`        | `string`    | Question context and details.                      |
| `hints`          | `string[]`  | Hints to solving the question, if any.             |
| `topicTags`      | `string[]`  | Topics that are associated to the question         |
| `discussionLink` | `string`    | Link to the question's discussion page on Leetcode |
| `createdAt`      | `timestamp` | When the question was seeded                       |
| `updatedAt`      | `timestamp` | When the question was last updated                 |

#### GraphQL Queries

Updated as of: 25th Septemeber 2022

##### All questions

```graphql
query psetQuestionList {
  psetQuestionList: questionList(
    categorySlug: ""
    limit: -1
    skip: 0
    filters: {}
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      paidOnly: isPaidOnly
      title
      titleSlug
      topicTags {
        slug
      }
    }
  }
}
```

##### Question of the day

```graphql
query questionOfToday {
  activeDailyCodingChallengeQuestion {
    question {
      acRate
      difficulty
      paidOnly: isPaidOnly
      title
      titleSlug
      topicTags {
        slug
      }
      hasSolution
      hasVideoSolution
    }
  }
}
```

##### Get question from slug

```graphql
query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
    hints
    topicTags {
      name
    }
  }
}

# var
# {
#  "titleSlug": "two-sum"
# }
```

### Potential upgrades

* [ ] Allow users to browse questions -- "solo mode"
* [ ] Display summary of question before entering room

### Progress

* [x] Serverless function CRUD -- Recess Week
* [x] Serverless function scheduling -- Recess Week
* [x] Backend -- Recess Week
* [ ] Frontend -- Week 7

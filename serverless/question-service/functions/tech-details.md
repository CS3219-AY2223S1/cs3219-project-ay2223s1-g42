## Question Service

### Functional Requirements

1. Matched users should be served the same question based on their matching criteria.
2. System should be able to get questions by difficulty and topic.
3. Users should be able to see the details of the question at a glance.

### Non-functional Requirements

1. Questions, summary and details, should be served to users within 3 seconds.

### Detailed Design

#### Schemas

This is based of what LeetCode returns, for the actual schema that was applied, refer to `prisma/schema.prisma` which also covers the relations.

##### Question List Summary

| Column Name        | Data Type   | Description                                   |
| ------------------ | ----------- | --------------------------------------------- |
| `acRate`           | `number`    | Solution acceptance rate (%)                  |
| `difficulty`       | `string`    | Difficulty level of the question              |
| `paidOnly`         | `boolean`   | Is the question only available to paid users? |
| `title`            | `string`    | Question title                                |
| `titleSlug`        | `string`    | Slug associated to question                   |
| `topicTags`        | `string[]`  | Topics that are associated to the question    |
| `hasSolution`      | `boolean`   | Does the question include a solution?         |
| `hasVideoSolution` | `boolean`   | Does the question include a video solution?   |
| `createdAt`        | `timestamp` | When the question was seeded                  |
| `updatedAt`        | `timestamp` | When the question was last updated            |


##### Question Details

| Column Name | Data Type   | Description                                |
| ----------- | ----------- | ------------------------------------------ |
| `content`   | `string`    | Question context and details.              |
| `hints`     | `string[]`  | Hints to solving the question, if any.     |
| `topicTags` | `string[]`  | Topics that are associated to the question |
| `createdAt` | `timestamp` | When the question was seeded               |
| `updatedAt` | `timestamp` | When the question was last updated         |


#### GraphQL Queries

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
      hasSolution
      hasVideoSolution
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

- [ ] Allow users to browse questions -- "solo mode"
- [ ] Display summary of question before entering room

### Progress

- [x] Serverless function CRUD
- [x] Serverless function scheduling
- [ ] Backend
- [ ] Frontend

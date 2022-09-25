export const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

export const ALL_QUESTIONS_QUERY = JSON.stringify({
  query: `query psetQuestionList {
  psetQuestionList: questionList(
    categorySlug: ""
    limit: -1
    skip: 0
    filters: {}
  ) {
    questions: data {
    #   frontendQuestionId: questionFrontendId
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
}`,
  variables: {},
});

export const QUESTION_OF_THE_DAY_QUERY = JSON.stringify({
  query: `query questionOfToday {
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
        }
    }
}`,
  variables: {},
});

export function getQuestionFromSlug(slug: string) {
  return JSON.stringify({
    query: `query getQuestionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
    hints
    topicTags {
      name
    }
  }
}`,
    variables: { titleSlug: `${slug}` },
  });
}

export function getQuestionSlugFromTopicSlug(topicSlug: string) {
  return JSON.stringify({
    query: `query getTopicFromTag($slug: String) {
  topicTag(slug: $slug) {
    name
    slug
    questions {
        titleSlug
    }
  }
}`,
    variables: { slug: `${topicSlug}` },
  });
}

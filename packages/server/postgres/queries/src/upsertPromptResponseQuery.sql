/*
  @name upsertPromptResponseQuery
  @param response -> (meetingId, userId, sortOrder, content)
*/
INSERT INTO "TeamPromptResponse" ("meetingId", "userId", "sortOrder", "content")
VALUES :response;

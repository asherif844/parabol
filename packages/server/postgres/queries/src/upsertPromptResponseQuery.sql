/*
  @name upsertPromptResponseQuery
  @param response -> (meetingId, userId, sortOrder, content, plaintextContent)
*/
INSERT INTO "TeamPromptResponse" ("meetingId", "userId", "sortOrder", "content", "plaintextContent")
VALUES :response;

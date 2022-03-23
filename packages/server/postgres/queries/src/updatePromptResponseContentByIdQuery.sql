/*
  @name updatePromptResponseContentByIdQuery
*/

UPDATE "TeamPromptResponse" SET
  "content" = :content
WHERE "id" = :id;

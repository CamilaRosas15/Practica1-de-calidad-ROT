import actionCreateComment from "@/app/actions/createComment";
import { API } from "@/lib/constants/apiRoutes";
import { ClerkAuthUserId, useSWRMutationWithAuthKey } from "@/lib/hooks/useSWRWithAuthKey";

export type ServerCreateCommentArgs = Pick<CommentTable, "entity_type" | "entity_id" | "content">;

type ClientCreateCommentArgs = StrictOmit<ServerCreateCommentArgs, "content">;

export const useCreateComment = (args: ClientCreateCommentArgs, userId: ClerkAuthUserId) => {
  const { entity_type, entity_id } = args;

  const { trigger, isMutating } = useSWRMutationWithAuthKey(API.COMMENT.getAllByThisEntity(entity_id, entity_type), userId, actionCreateComment);

  return {
    createComment: async (content: string) => {
      try {
        const result = await trigger({ content, entity_type, entity_id });

        return result;
      } catch (err) {
        console.error("Error creating comment:", err);
        throw err;
      }
    },
    isCreating: isMutating,
  };
};

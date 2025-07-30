import useSWRMutation from "swr/mutation";

import actionCreateApplication, { CreateApplicationArgs } from "@/app/actions/createApplication";
import { API } from "@/lib/constants/apiRoutes";

type CreateApplicationParams = StrictOmit<CreateApplicationArgs, "job_posting_id">;

export const useCreateApplication = (job_posting_id: string) => {
  const { trigger, isMutating } = useSWRMutation(API.APPLICATION.getAllByJobPostingId(job_posting_id), actionCreateApplication);

  return {
    createApplication: async (params: CreateApplicationParams) => {
      const result = await trigger({ job_posting_id, ...params });

      if (!result.isSuccess) {
        throw new Error(result.error);
      }
    },
    isCreating: isMutating,
  };
};

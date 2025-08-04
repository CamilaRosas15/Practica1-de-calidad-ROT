import useSWRMutation from "swr/mutation";

import actionCreateJob from "@/app/actions/createJob";
import { AddJobFormData } from "@/lib/schema/addJobSchema";
import { API } from "@/lib/constants/apiRoutes";

const useCreateJob = (company_id: string) => {
  const { trigger, isMutating } = useSWRMutation(API.JOB_POSTING.getAllByCompanyId(company_id), actionCreateJob);

  return {
    createJob: async (newJob: AddJobFormData, company_name: string) => {
      const result = await trigger({ company_id, newJob, company_name });

      if (!result.isSuccess) {
        // Create an error object with the returned error message
        throw new Error(result.error);
      }

      return true;
    },
    isCreating: isMutating,
  };
};

export { useCreateJob };

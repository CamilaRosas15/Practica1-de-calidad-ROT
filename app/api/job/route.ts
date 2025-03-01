import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { nuqsJobSearchParamLoader } from "@/lib/schema/nuqsJobSearchParamSchema";
import { createClerkSupabaseClientSsr } from "@/lib/supabase";
import { AllJobsPageData } from "@/app/jobs/AllJobSearchResult";
import { DB_RPC } from "@/lib/constants/apiRoutes";

export type AllJobsPageResponse = {
  data: AllJobsPageData[];
  totalPages: number;
};

export async function GET(request: NextRequest) {
  const { userId } = auth();

  // Parse search params from the request
  const { page, search, isVerified, countries, sortOrder, experienceLevelNames, jobCategoryNames } = await nuqsJobSearchParamLoader(request);

  // console.warn("countries=", countries);
  // console.warn("experienceLevelNames=", experienceLevelNames);
  // console.warn("jobCategoryNames=", jobCategoryNames);

  const supabase = await createClerkSupabaseClientSsr();

  const { data, error } = await supabase.rpc(DB_RPC.GET_ALL_SEARCH_JOBS, {
    p_page: page,
    p_search: search,
    p_is_verified: isVerified,
    p_country_names: countries,
    p_sort_order: sortOrder,
    p_experience_level_names: experienceLevelNames,
    p_job_category_names: jobCategoryNames,
    p_user_id: userId,
  });

  if (error) {
    console.error("error. searching jobs", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

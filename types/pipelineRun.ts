export interface PipelinerRunType {
    branch_name?: string;
    commit_hash?: string;
    created_at?: string;
    date?: string;
    id?: number;
    pipeline_id?: number;
    status?: number;
    updated_at?: string;
    cicd_pipeline_id: number;
    pipeline_run_url: string;
}

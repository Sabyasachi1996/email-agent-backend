declare namespace Express {
  export interface Request {
    id?:string;
    permission?:Record<string,boolean>,
    permissionMeta?:{sectionName:string,actionName:string },
    user?: {
      id: string;
      role_id: string;
      role_name: string;
      role_branch_id: string;
      user_branch_id: string;
    };
  }
}

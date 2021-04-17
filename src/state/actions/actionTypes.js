/**
 *   remote - relation action (with payload keyword - remote)
 */

 export const START_FETCH_DATA = "start_fetch_data";
 export const FINISH_FETCH_DATA = "finish_fetch_data";
 
 export const START_PUSH_FILE  = "start_push_file";
 export const FINISH_PUSH_FILE = "finish_push_file";
 
 export const START_PULL_FILE  = "start_pull_file";
 export const FINISH_PULL_FILE = "finish_pull_file";

 export const START_CREATE_BRANCH = "start_create_branch";
 export const FINISH_CREATE_BRANCH = "finish_create_branch";

 /**
  *  pure UI action
  */
 
 export const CHANGE_CURRENT_REMOTE = "change_current_remote";
 export const RESET_UI_COFIG = "reset_ui_config";
 export const CHANGE_CURRENT_REPO= "change_current_repo";
 export const CHANGE_CURRENT_BRANCH= "change_current_branch";
 export const CHANGE_CURRENT_ROOT = "change_current_root";

 /**
  *   Error action
  */

 export const ERROR_WHEN_USE_API_CALL = "error_when_use_api_call";
 export const CLOSE_ERROR_MESSAGE = "close_error_message";
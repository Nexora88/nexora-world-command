import {getAccount,verifyToken} from "./auth-store";
export function getAuthenticatedAccount(req:Request){const raw=req.headers.get("cookie")?.match(/(?:^|;\s*)nwc_session=([^;]+)/)?.[1];const id=raw?verifyToken(decodeURIComponent(raw)):null;return id?getAccount(id):null}
export function requireAccount(req:Request){const account=getAuthenticatedAccount(req);if(!account)throw new Error("ONLINE_ACCOUNT_REQUIRED");return account}

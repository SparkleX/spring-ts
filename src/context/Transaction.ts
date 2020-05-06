import { ApplicationContext } from "./ApplicationContext";

export async function txTransaction(func: Function): Promise<any> {
    const rt = await ApplicationContext.DEFAULT.transaction(func);
    return rt;
}

export async function txAutoCommit(func: Function): Promise<any> {
    const rt = await ApplicationContext.DEFAULT.autoCommit(func);
    return rt;
}
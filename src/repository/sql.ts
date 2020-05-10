import { ApplicationContext } from "../context";
import { Connection } from "../db";

export function sql(sql: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        descriptor.value = async function(param: any): Promise<any> {
            var conn: Connection = await ApplicationContext.DEFAULT.getConnection();
            return await conn.executeQuery(sql, param);
        };
        return descriptor;
    };
}

export function sqlOne(sql: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        descriptor.value = async function(param: any): Promise<any> {
            var conn: Connection = await ApplicationContext.DEFAULT.getConnection();
            var result =  await conn.executeQuery(sql, param);
            return result[0];
        };
        return descriptor;
    };
}
export function sqlScalar(sql: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        descriptor.value = async function(param: any): Promise<any> {
            var conn: Connection = await ApplicationContext.DEFAULT.getConnection();
            var result =  await conn.executeQuery(sql, param);
            var rowZero = result[0];
            const key = Object.keys(rowZero)[0];
            return rowZero[key];
        };
        return descriptor;
    };
}
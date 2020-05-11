import { BaseRepository } from "../repository/BaseRepository";

export abstract class BaseService<T, ID, REPO extends BaseRepository<T, ID>> {

	abstract getRepository(): REPO;

    public async findById(key: ID): Promise<T> {
		return this.getRepository().findById(key);
    }
    public async create(object: T): Promise<T> {
        await this.onIsValid(object);
        await this.getRepository().insert(object);
        return object;
    }
    protected async onIsValid(object: T): Promise<void> {}
    public async findAll(): Promise<T[]> {
        return await this.getRepository().findAll();
    }
    public async delete(id: ID): Promise<void> {
        return this.getRepository().delete(id);
    }
    public async update(id: ID, object: T): Promise<void> {
       return this.getRepository().update(id, object);
    }
}

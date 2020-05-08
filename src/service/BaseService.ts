import { BaseRepository } from "../repository/BaseRepository";

export abstract class BaseService<T, ID, REPO extends BaseRepository<T, ID>> {
	protected repo: REPO;

    public init(): void {
        this.repo = this.initRepo();
	}
	abstract initRepo () : REPO;
    public async findById(key: ID): Promise<T> {
		return this.repo.findById(key);
    }
    public async create(object: T): Promise<T> {
        await this.onIsValid(object);
        await this.repo.insert(object);
        return object;
    }
    protected async onIsValid(object: T): Promise<void> {}
    public async findAll(): Promise<T[]> {
        return await this.repo.findAll();
    }
    public async delete(id: ID): Promise<void> {
        return this.repo.delete(id);
    }
    public async update(id: ID, object: T): Promise<void> {
       return this.repo.update(id, object);
    }
}

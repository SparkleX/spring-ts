import { BaseService } from "../BaseService";
import { BaseRepository } from "../../repository/BaseRepository";

interface Example {

}

class ExampleRepo extends BaseRepository<Example, any> {
	protected getTableName(): string {
		return "example";
	}
}
const mockFindAll =  jest.fn();
ExampleRepo.prototype.findAll = mockFindAll;

const mockFindById =  jest.fn();
ExampleRepo.prototype.findById = mockFindById;

const mockCreate =  jest.fn();
ExampleRepo.prototype.insert = mockCreate;

const mockUpdate =  jest.fn();
ExampleRepo.prototype.update = mockUpdate;

const mockDelete =  jest.fn();
ExampleRepo.prototype.delete = mockDelete;

class ExampleService extends BaseService<Example, any, ExampleRepo> {
	repo: ExampleRepo;
	constructor() {
		super();
		this.repo = new ExampleRepo();
	}
	getRepository(): ExampleRepo {
		return this.repo;
	}
}
const service = new ExampleService();

test("create", async () => {
	const data = { a: 1 };
	const dataReturn = await service.create(data);
	expect(mockCreate.mock.instances.length).toBe(1);
	expect(mockCreate.mock.calls[0][0]).toBe(data);
	expect(dataReturn).toBe(data);
});

test("updateById", async () => {
	const id = { id: 1 };
	const data = { id: 1, data: 2 };
	await service.update(id, data);
	expect(mockUpdate.mock.instances.length).toBe(1);
	expect(mockUpdate.mock.calls[0][0]).toBe(id);
	expect(mockUpdate.mock.calls[0][1]).toBe(data);
});


test("delete", async () => {
	const id = { a: 1 };
	await service.delete(id);
	expect(mockDelete.mock.instances.length).toBe(1);
	expect(mockDelete.mock.calls[0][0]).toBe(id);

});

test("find all", async () => {
	const data = [1,2,3];
	mockFindAll.mockReturnValue(data);
	const dataReturn = await service.findAll();
	expect(mockFindAll.mock.instances.length).toBe(1);
	expect(dataReturn).toBe(data);
});

test("findById", async () => {
	const data = {a: 1};
	const id = 100;
	mockFindById.mockReturnValue(data);
	const dataReturn = await service.findById(id);
	expect(mockFindById.mock.instances.length).toBe(1);
	expect(dataReturn).toBe(data);
});
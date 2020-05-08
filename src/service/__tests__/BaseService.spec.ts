import { BaseService } from "../BaseService";
import { BaseRepository } from "../../repository/BaseRepository";

interface Example {

}

class ExampleRepo extends BaseRepository<Example, any> {
	public initTableName(): string {
		return "example";
	}

}
const mockFindAll =  jest.fn();
ExampleRepo.prototype.findAll = mockFindAll;

const mockFindById =  jest.fn();
ExampleRepo.prototype.findById = mockFindById;

const mockCreate =  jest.fn();
ExampleRepo.prototype.insert = mockCreate;

const mockUpdateById =  jest.fn();
ExampleRepo.prototype.updateById = mockUpdateById;

const mockDelete =  jest.fn();
ExampleRepo.prototype.delete = mockDelete;

class ExampleService extends BaseService<Example, any, ExampleRepo> {
	initRepo(): ExampleRepo {
		return new ExampleRepo();
	}
}
const service = new ExampleService();
service.init();

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
	expect(mockUpdateById.mock.instances.length).toBe(1);
	expect(mockUpdateById.mock.calls[0][0]).toBe(id);
	expect(mockUpdateById.mock.calls[0][1]).toBe(data);
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
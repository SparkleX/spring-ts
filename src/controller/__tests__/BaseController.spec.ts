import { BaseController } from "../BaseController";
import * as context from '../../context';

//jest.mock('../../context');
(context as any).txTransaction = function (x) {
	return x();
}

interface ExampleId {
	id: number
}
interface Example {
	id: number,
	a: string
}
class ExampleController extends BaseController<Example, ExampleId, any> {
	protected getService() {
		return service;
	}

}

const service = {} as any;

const mockFindAll = jest.fn();
service.findAll = mockFindAll;

const mockFindById = jest.fn();
service.findById = mockFindById;

const mockCreate = jest.fn();
service.create = mockCreate;

const mockUpdate = jest.fn();
service.update = mockUpdate;

const mockDelete = jest.fn();
service.delete = mockDelete;

const req = {} as any;
const res = {} as any;
const mockStatus = jest.fn();
res.status = mockStatus;
const mockJson = jest.fn();
res.json = mockJson;
const mockEnd = jest.fn();
res.end = mockEnd;

beforeEach(() => {
	mockCreate.mockClear();
	mockUpdate.mockClear();
	mockDelete.mockClear();
	mockStatus.mockClear();
	mockJson.mockClear();
	mockEnd.mockClear();
});
let controller = new ExampleController();
test("findall", async () => {
	const data = [{a:1}, {a:2}]
	mockFindAll.mockReturnValue(data);
	mockStatus.mockReturnValue(res);

	await controller.defaultFindAll(req, res);
	expect(mockFindAll.mock.instances.length).toBe(1);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(200);
	expect(mockJson.mock.instances.length).toBe(1);
	expect(mockJson.mock.calls[0][0]).toBe(data);
});
test("find by id", async () => {
	const data = [{a:1}, {a:2}]
	mockFindById.mockReturnValue(data);
	mockStatus.mockReturnValue(res);

	await controller.defaultFindById(req, res, {id: 1});
	expect(mockFindById.mock.instances.length).toBe(1);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(200);
	expect(mockJson.mock.instances.length).toBe(1);
	expect(mockJson.mock.calls[0][0]).toBe(data);
});

test("create", async () => {
	const data = {id: 1, a:'a'};
	const rtData = {id: 1, a:'b'};

	mockCreate.mockReturnValue(rtData);
	mockStatus.mockReturnValue(res);
	await controller.defaultCreate(req, res, data);

	expect(mockCreate.mock.instances.length).toBe(1);
	expect(mockCreate.mock.calls[0][0]).toBe(data);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(201);

	expect(mockJson.mock.instances.length).toBe(1);
	expect(mockJson.mock.calls[0][0]).toBe(rtData);
});
test("create from body", async () => {
	const data = {id: 1, a:'a'};
	const rtData = {id: 1, a:'b'};
	req.body = data;

	mockCreate.mockReturnValue(rtData);
	mockStatus.mockReturnValue(res);
	await controller.defaultCreate(req, res);
	expect(mockCreate.mock.instances.length).toBe(1);
	expect(mockCreate.mock.calls[0][0]).toBe(data);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(201);

	expect(mockJson.mock.instances.length).toBe(1);
	expect(mockJson.mock.calls[0][0]).toBe(rtData);
});
test("update", async () => {
	const id = {id: 1};
	const data = {id:1, a:'a'};
	req.body = data;

	mockUpdate.mockReturnValue(data);
	mockStatus.mockReturnValue(res);

	await controller.defaultUpdate(req, res, id);
	expect(mockUpdate.mock.instances.length).toBe(1);
	expect(mockUpdate.mock.calls[0][0]).toBe(id);
	expect(mockUpdate.mock.calls[0][1]).toBe(data);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(204);
	expect(mockEnd.mock.instances.length).toBe(1);
});
test("update from body", async () => {
	const id = {id: 1};
	const data = {id:1, a:'a'};
	mockUpdate.mockReturnValue(data);
	mockStatus.mockReturnValue(res);

	await controller.defaultUpdate(req, res, id, data);
	expect(mockUpdate.mock.instances.length).toBe(1);
	expect(mockUpdate.mock.calls[0][0]).toBe(id);
	expect(mockUpdate.mock.calls[0][1]).toBe(data);

	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(204);
	expect(mockEnd.mock.instances.length).toBe(1);
});
test("delete", async () => {
	const id = {id: 1};
	mockStatus.mockReturnValue(res);

	await controller.defaultDelete(req, res, id);
	expect(mockDelete.mock.instances.length).toBe(1);
	expect(mockDelete.mock.calls[0][0]).toBe(id);
	expect(mockStatus.mock.instances.length).toBe(1);
	expect(mockStatus.mock.calls[0][0]).toBe(204);
	expect(mockEnd.mock.instances.length).toBe(1);
});
import { BaseRepository } from "../../repository/BaseRepository";
import { ApplicationContext } from "../../context";
import { Result } from "../../db";

const mockExecute = jest.fn();
ApplicationContext.DEFAULT = {
	getConnection: async function () {
		return {
			execute: mockExecute,
		};
	},
} as any;

class ExampleRepo extends BaseRepository<any, any> {
	protected getTableName(): string {
		return "Example";
	}
	protected getQuote(): string {
		super.getQuote();
		return '"';
	}
}

const repo = new ExampleRepo();

beforeEach(() => {
	mockExecute.mockClear();
});
test("find all", async () => {
	const data: Result ={ updateCount: undefined, data : [ { a: 1 }] };
	mockExecute.mockReturnValue(data);

	var rt = await repo.findAll();
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from "Example"`);
	expect(rt).toStrictEqual(data.data);

});
test("find by id", async () => {
	const data: Result ={ updateCount: undefined, data : [ { id: 1, a: 1 }] };
	mockExecute.mockReturnValue(data);

	var id = { id: 1}
	var rt = await repo.findById(id);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from "Example" where "id"=?`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([1]);
	expect(rt).toStrictEqual(data.data[0]);

});
test("find by id not exists", async () => {
	const data: Result ={ updateCount: undefined, data : [] };
	mockExecute.mockReturnValue(data);

	var id = { id: 1}
	var rt = await repo.findById(id);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from "Example" where "id"=?`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([1]);
	expect(rt).toStrictEqual(null);

});
test("create", async () => {
	const data = { a: 1 };
	//mockExecute.mockReturnValue(dReturn);

	await repo.insert(data);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(
		`insert into "Example"("a") values(?)`
	);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([1]);
});

test("update", async () => {
	const id = { id: 1 };
	const data = { a: 'a', b:'b' };
	//mockExecute.mockReturnValue(dReturn);

	await repo.update(id, data);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`update "Example" set "a"=?,"b"=? where "id"=?`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual(['a','b',1]);
});

test("delete", async () => {
	const id = { id: 1, line:'2' };

	await repo.delete(id);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`delete from "Example" where "id"=? and "line"=?`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([1,'2']);
});
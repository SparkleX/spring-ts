import { BaseRepository } from "../../repository/BaseRepository";
import { ApplicationContext } from "../../context";



const mockExecute =  jest.fn();
ApplicationContext.DEFAULT = {
	getConnection : async function () {
		return {
			execute : mockExecute
		}
	}
} as any;


class ExampleRepo extends BaseRepository<any, any> {
	public initTableName(): string {
		return "TBL"
	}
}

const repo = new ExampleRepo();
repo.init();
test("create", async () => {
	const data = { a: 1 };
	const dReturn = { id: 1, a: 1 };
	mockExecute.mockReturnValue(data);

	const dataReturn = await repo.insert(data);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`insert into "TBL"("a") values(?)`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([1]);

	expect(dataReturn).toBe(dReturn);
});

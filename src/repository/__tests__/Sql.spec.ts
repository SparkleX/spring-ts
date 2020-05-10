import { ApplicationContext } from "../../context";
import { sql, sqlOne, sqlScalar } from '../sql';

const mockExecute = jest.fn();
ApplicationContext.DEFAULT = {
	getConnection: async function () {
		return {
			executeQuery: mockExecute,
		};
	},
} as any;

class ExampleRepo {
    @sql("select * from test")
	public async findNoParam(): Promise<any>  { throw -1; }
    @sql("select * from test where id=?")
	public async findWithParam (param: any): Promise<any>  { throw -1; }	
    @sqlOne("select * from test")
    public async findOne(): Promise<any>  { throw -1; }	
	@sqlScalar("select count(*) from test")
    public async findScalar(): Promise<any>  { throw -1;} 
}

const repo = new ExampleRepo();

beforeEach(() => {
	mockExecute.mockClear();
});
test("find no params", async () => {
	const mockReturn =[ { a: 1 }];
	mockExecute.mockReturnValue(mockReturn);
	var rt = await repo.findNoParam();
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from test`);
	expect(rt).toStrictEqual(mockReturn);
});
test("find with params", async () => {
	const mockReturn =[ { a: 1 }];
	mockExecute.mockReturnValue(mockReturn);
	var rt = await repo.findWithParam([100]);
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from test where id=?`);
	expect(mockExecute.mock.calls[0][1]).toStrictEqual([100]);
	expect(rt).toStrictEqual(mockReturn);	
});
test("find one", async () => {
	const mockReturn =[ { a: 1 }, {a : 2}];
	mockExecute.mockReturnValue(mockReturn);
	var rt = await repo.findOne();
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select * from test`);
	expect(rt).toStrictEqual(mockReturn[0]);
});

test("find scalar ", async () => {
	const mockReturn =[ { a: 1, b:3 }, {a : 2, b: 4}];
	mockExecute.mockReturnValue(mockReturn);
	var rt = await repo.findScalar();
	expect(mockExecute.mock.instances.length).toBe(1);
	expect(mockExecute.mock.calls[0][0]).toBe(`select count(*) from test`);
	expect(rt).toStrictEqual(1);
});
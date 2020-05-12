import { Request, Response } from 'express';
import { BaseService } from '../service/BaseService';
import { txTransaction } from '../context';

export abstract class BaseController<T, ID, TService extends BaseService<T, ID, any>> {
	protected abstract  getService(): TService;
    public async defaultFindAll(req: Request, res: Response): Promise<void> {
        const data = await txTransaction(() => this.getService().findAll());
        res.status(200).json(data);
    }
    public async defaultFindById(req: Request, res: Response, id: ID): Promise<void> {
        const data = await txTransaction(() => this.getService().findById(id));
        res.status(200).json(data);
    }
    public async defaultCreate(req: Request, res: Response, body?: T): Promise<void> {
		if( !body ) {
			body = req.body;
		}
        const data = await txTransaction(() => this.getService().create(body));
        res.status(201).json(data);
    }
    public async defaultUpdate(req: Request,res: Response, id: ID, body?: T): Promise<void> {
		if( !body ) {
			body = req.body;
		}
        await txTransaction(() => this.getService().update(id, body));
        res.status(204).end();
    }
    public async defaultDelete(req: Request,res: Response, id: ID): Promise<void> {
        await txTransaction(() => this.getService().delete(id));
        res.status(204).end();
    }
}
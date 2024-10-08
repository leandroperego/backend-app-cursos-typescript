import { Request, Response, Express } from 'express';
import SessaoRouter from './SessaoRouter';
import AlunosRouter from './AlunosRouter';
import CursosRouter from './CursosRouter';
import { ObterIdUsuarioDTO } from '../DTO/UsuarioDTO';
import CustomRequest from '../controllers/CustomRequest';
import CursosRepository from '../repository/CursosRepository';
import Auth from '../utils/middlewares/AuthenticationMiddleware';
import { param, validationResult } from 'express-validator';

const routes = (app: Express) => {
    app.use('/', SessaoRouter);
    app.use('/usuarios', AlunosRouter);
    app.use('/cursos', CursosRouter);
    app.get('/:id', Auth.isAuth, async (req: CustomRequest, res: Response) => {

        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                errors: errosValidacao.array()
            });
            return;
        }

        const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;
        const { id: id_rota } = req.params;

        if (id_user !== Number(id_rota)) {
            res.status(403).json({ 
                type: 'error', 
                mensagem: 'Não autorizado' 
            });
            return;
        }
       const cursos = await CursosRepository.findAllRegistration(id_user);

        res.status(200).json(cursos);
    });
    app.get('/:any', (req: Request, res: Response) => res.status(404).send('404 - Not Found'));
}

export default routes;
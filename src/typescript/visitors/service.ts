import { Path } from '../../visitor/path';
import { Visitor } from '../../visitor/type';
import { ServiceTree } from '../generator/service';

export class ServiceVisitor {
  private readonly services: ServiceTree[] = [];
  private readonly visitor: Visitor = {
    Proto: {
      enter: (path: Path): void => {
        path.context.services = this.services;
      },
    },
    Service: {
      enter: (path: Path): void => {
        const service = path.node as Service;
        this.services.push({
          name: service.name.name,
          methods: [],
        });
      },
      exit: (path: Path): void => {
        //
      },
    },
    Rpc: {
      enter: (path: Path): void => {
        const rpc = path.node as RpcField;
        const service = this.services.slice(-1)[0];
        service.methods.push({
          type: 'rpc',
          name: rpc.name.name,
          argTypeName: rpc.argTypeName,
          returnTypeName: rpc.returnTypeName,
        });
      },
    },
  };

  public getVisitor(): Visitor {
    return this.visitor;
  }
}

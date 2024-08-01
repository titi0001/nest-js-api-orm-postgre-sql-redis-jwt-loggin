import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelacionaPedidoItemEProduto1722475604425
  implements MigrationInterface
{
  name = 'RelacionaPedidoItemEProduto1722475604425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pedido_itens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" integer NOT NULL, "preco_venda" integer NOT NULL, "pedidoId" uuid, "produtoId" uuid, CONSTRAINT "PK_82e4f6ce11df2878bc7a54c5797" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pedido_itens" ADD CONSTRAINT "FK_4905b2c69d25dcaffa46110e0c0" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pedido_itens" ADD CONSTRAINT "FK_46f6c7e2d999a308343841272a1" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pedido_itens" DROP CONSTRAINT "FK_46f6c7e2d999a308343841272a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pedido_itens" DROP CONSTRAINT "FK_4905b2c69d25dcaffa46110e0c0"`,
    );
    await queryRunner.query(`DROP TABLE "pedido_itens"`);
  }
}

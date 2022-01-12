// https://github.com/ramiel/mongoose-sequence/issues/83
import {
  getModelForClass,
  prop,
  mongoose,
  modelOptions,
  Severity,
} from '@typegoose/typegoose';
import { BlockJSON } from 'slate';

type ComponentData = BlockJSON['data'] & {
  nodes: BlockJSON['nodes'];
};

modelOptions({ options: { allowMixed: Severity.ALLOW } });
class Component {
  @prop({
    required: true,
    type: String,
  })
  public code: string;

  @prop({
    required: true,
    type: mongoose.Schema.Types.Mixed,
  })
  public data: ComponentData;
}

modelOptions({ options: { allowMixed: Severity.ALLOW } });
class Article {
  @prop({
    required: true,
    type: String,
  })
  public title: string;

  @prop({
    required: true,
    type: Component,
  })
  public components: Component[];
}

const ArticleModel = getModelForClass(Article);

(async () => {
  await mongoose.connect('mongodb://localhost:27017/', {
    keepAlive: true,
    dbName: 'localTest',
    autoIndex: true,
  });

  const article = new ArticleModel({
    title: 'hi',
    components: [
      {
        code: 'paragraph',
        data: {
          nodes: [
            {
              object: 'text',
              // FIXME: error
              // leaves: [
              //   {
              //     object: 'leaf',
              //     text: 'foo foo foo',
              //     marks: [],
              //   },
              // ],
            },
          ],
        },
      },
    ],
  });

  await Promise.all([article.save()]);

  process.exit(0);
})();

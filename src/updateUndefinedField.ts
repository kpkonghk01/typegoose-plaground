// https://github.com/ramiel/mongoose-sequence/issues/83
import { getModelForClass, prop, plugin, mongoose } from '@typegoose/typegoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

@plugin(AutoIncrement, {
  id: 'article_sequenceId',
  inc_field: 'sequenceId',
  start_seq: 101,
})
class Article {
  @prop({
    required: true,
    type: String,
  })
  public title: string;

  @prop({
    required: true,
    type: String,
  })
  public content: string;

  @prop({
    type: Number,
  })
  public sequenceId: Number;
}

const ArticleModel = getModelForClass(Article);

(async () => {
  await mongoose.connect('mongodb://localhost:27017/', {
    keepAlive: true,
    dbName: 'localTest',
    autoIndex: true,
  });

  const article = new ArticleModel({ title: 'Title', content: 'something' });

  await Promise.all([article.save()]);

  await ArticleModel.findOneAndUpdate(
    {
      _id: article._id,
    },
    {
      title: undefined,
      content: 'updated',
    }
  );

  process.exit(0);
})();

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
    type: Number,
  })
  public sequenceId: Number;
}

@plugin(AutoIncrement, {
  id: 'story_sequenceId',
  inc_field: 'sequenceId',
  start_seq: 1001,
})
class Story {
  @prop({
    required: true,
    type: String,
  })
  public title: string;

  @prop({
    type: Number,
  })
  public sequenceId: Number;
}

const ArticleModel = getModelForClass(Article);
const StoryModel = getModelForClass(Story);

(async () => {
  await mongoose.connect('mongodb://localhost:27017/', {
    keepAlive: true,
    dbName: 'localTest',
    autoIndex: true,
  });

  const article1 = new ArticleModel({ title: 'Title1' });
  const article2 = new ArticleModel({ title: 'Title2' });

  await Promise.all([article1.save(), article2.save()]);

  const story1 = new StoryModel({ title: 'Title1' });
  const story2 = new StoryModel({ title: 'Title2' });

  await Promise.all([story1.save(), story2.save()]);

  process.exit(0);
})();

import { getModelForClass, prop, mongoose } from '@typegoose/typegoose';

class Author {
  @prop({
    required: true,
    type: String,
  })
  public name: string;
}

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
  public authorId: string;
}

const ArticleModel = getModelForClass(Article);
const AuthorModel = getModelForClass(Author);

(async () => {
  await mongoose.connect('mongodb://localhost:27017/', {
    keepAlive: true,
    dbName: 'localTest',
    autoIndex: true,
  });

  const author = new AuthorModel({ name: 'Mary' });

  await Promise.all([author.save()]);

  const article = new ArticleModel({
    title: 'has a sheep',
    authorId: author._id,
  });

  await Promise.all([article.save()]);

  const result = await ArticleModel.findById(article._id);
  console.table({
    authorId: result.authorId,
    typeOfAuthorId: typeof result.authorId,
  });

  process.exit(0);
})();

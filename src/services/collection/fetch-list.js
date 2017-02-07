const slug = require('slug');

const Collection = require('models/collection');

function toSlug(text) {
  const slugText = slug(text, { lower: true });
  return slugText.length > 64 ?
    slugText.slice(0, 64) :
    slugText;
}

module.exports = function ({ user }) {
  return (
    Collection.
      find(
        { $or: (user ? [ { _user: user } ] : []).concat({ public: true }) },
        { _user: 1,
          description: 1,
          pmid: 1,
          public: 1,
          size: 1,
          speciesId: 1,
          status: 1,
          title: 1,
          uuid: 1,
        }
      ).
      then(collections => collections.map(doc => {
        const collection = doc.toObject();
        const { _user, uuid, title } = collection;
        const { id } = user || {};
        collection.owner = _user && _user.toString() === id ? 'me' : 'other';
        collection.id = doc._id.toString();
        collection.slug = `${uuid}-${toSlug(title)}`;
        delete collection._user;
        delete collection.uuid;
        return collection;
      }))
  );
};

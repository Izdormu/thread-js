class Post {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike = true, isDislike = false }) {
    const updateOrDelete = react => {
      if (react.isLike === isLike && react.isDislike === isDislike) {
        return this._postReactionRepository.deleteById(react.id);
      }
      if (react.isLike === isLike) {
        return this._postReactionRepository.updateById(react.id, { isDislike });
      }
      if (react.isDislike === isDislike) {
        return this._postReactionRepository.updateById(react.id, { isLike });
      }
      return this._postReactionRepository.updateById(react.id, { isLike, isDislike });
    };
    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );
    const result = reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike, isDislike });
    return Number.isInteger(result)
      ? {}
      : this._postReactionRepository.getPostReaction(userId, postId);
  }
}

export { Post };

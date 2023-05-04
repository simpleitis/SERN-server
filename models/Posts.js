module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      postText: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      username: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  });

// "models" has access to all the models inside our project 
  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
        // Below line ensure that when we delete a post, all the comments associated with the post if also deleted
        onDelete: 'cascade'
    })

    Posts.hasMany(models.Likes, {
      onDelete: 'cascade'
    })
  }
  return Posts
}
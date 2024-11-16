  ...result,
        postsList: result.postsList.map((post) => ({
          id: post._id,
          userId: post.user,
          title: post.title,
          body: post.body,
        })),
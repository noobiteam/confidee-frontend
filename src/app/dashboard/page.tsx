"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WalletButton from "@/components/WalletButton";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import { saveLike, removeLike, hasUserLiked, getLikeData } from "@/utils/likes";
import { getPosts, savePost, updatePost, Post } from "@/utils/posts";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DashboardPage() {
  const { address } = useAccount();
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!address) {
      router.push("/");
      return;
    }

    const storedPosts = getPosts();
    setPosts(storedPosts);
  }, [address, router]);

  useEffect(() => {
    setPosts((prev) =>
      prev.map((post) => {
        const { likes, likeCount } = getLikeData(post.id);
        return {
          ...post,
          likes,
          likeCount,
        };
      })
    );
  }, []);

  const handlePostSubmit = (content: string) => {
    const postId = Date.now().toString();
    const { likes, likeCount } = getLikeData(postId);

    const newPost: Post = {
      id: postId,
      content,
      timestamp: new Date(),
      wallet: address || "",
      likes,
      likeCount,
      totalTips: 0,
      replies: [],
    };

    savePost(newPost);
    setPosts((prev) => [newPost, ...prev]);

    setTimeout(() => {
      const aiResponseContent = generateAIResponse();
      const updatedPost = {
        ...newPost,
        aiResponse: {
          content: aiResponseContent,
          timestamp: new Date(),
        },
      };

      savePost(updatedPost);
      setPosts((prev) =>
        prev.map((post) => (post.id === newPost.id ? updatedPost : post))
      );
    }, 2000);
  };

  const handleReplyClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleLike = (postId: string) => {
    if (!address) return;

    const walletAddress = address;
    const userHasLiked = hasUserLiked(postId, walletAddress);

    if (userHasLiked) {
      removeLike(postId, walletAddress);
    } else {
      saveLike(postId, walletAddress);
    }

    const { likes, likeCount } = getLikeData(postId);

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            likes,
            likeCount,
          };
          updatePost(postId, { likes, likeCount });
          return updatedPost;
        }
        return post;
      })
    );
  };

  const generateAIResponse = () => {
    const responses = [
      "I hear you anon. That sounds really tough. Remember that setbacks are temporary, and you're stronger than you think. Take it one day at a time.",
      "Thanks for sharing this with us. What you're feeling is completely valid. Have you considered talking to someone you trust about this?",
      "That's a lot to process. Sometimes writing down our thoughts like this can be the first step toward feeling better. You're not alone in this.",
      "I appreciate you being vulnerable here. It takes courage to share what's really on your mind. How are you taking care of yourself right now?",
      "This resonates with me. Life can be overwhelming sometimes. What's one small thing that usually helps you feel a bit better?",
      "Thank you for trusting the community with this. Your feelings matter, and it's okay to not have all the answers right now.",
      "I can sense the weight you're carrying. Sometimes just getting these thoughts out can provide some relief. What support do you have around you?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!address) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
      <div className="relative flex-1">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Confidee
              </Link>
              <WalletButton />
            </div>
          </div>
        </nav>

        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to your safe space
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
              Share whatever&apos;s on your heart, we&apos;re here to listen
            </p>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors"
            >
              Ready to share?
            </button>
          </div>
        </section>

        <section className="pb-12 sm:pb-20 px-4 sm:px-6 lg:px-20">
          <div className="mx-auto">
            {posts.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="w-full sm:w-[45%] md:w-[40%]">
                    <PostCard
                      id={post.id}
                      content={post.content}
                      timestamp={post.timestamp}
                      wallet={post.wallet}
                      likes={post.likes}
                      likeCount={post.likeCount}
                      totalTips={post.totalTips}
                      currentUserWallet={address || ""}
                      aiResponse={post.aiResponse}
                      replies={post.replies}
                      onReply={handleReplyClick}
                      onLike={handleLike}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="rounded-2xl p-8 sm:p-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Your space is ready for your first thought
                  </h3>
                  <p className="text-gray-600">
                    This is where your story begins
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </main>
  );
}

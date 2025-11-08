import { useReadContract } from 'wagmi'
import { CONTRACT_CONFIG } from '@/config/contract'
import ConfideeABI from '@/abi/Confidee.json'
import { useEffect, useState } from 'react'

interface Stats {
  totalUsers: number
  totalPosts: number
  totalValueETH: string
  totalValueUSD: string
  isLoading: boolean
}

interface Post {
  owner: string
  totalTips: bigint
}

export function useStats(): Stats {
  const [ethPrice, setEthPrice] = useState<number>(0)
  const [uniqueUsers, setUniqueUsers] = useState<Set<string>>(new Set())

  // Get total posts
  const { data: totalPosts, isLoading: isLoadingPosts } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getTotalSecrets',
  })

  // Get all posts to calculate unique users and total tips
  const { data: allPosts, isLoading: isLoadingAllPosts } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: ConfideeABI,
    functionName: 'getLatestSecrets',
    args: [BigInt(50)], // Get latest 50 posts
  })

  // Fetch ETH price
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        const data = await response.json()
        setEthPrice(data.ethereum.usd)
      } catch (error) {
        console.error('Error fetching ETH price:', error)
        setEthPrice(0)
      }
    }
    fetchEthPrice()
    // Refresh price every 60 seconds
    const interval = setInterval(fetchEthPrice, 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate unique users and total tips
  useEffect(() => {
    if (allPosts && Array.isArray(allPosts)) {
      const users = new Set<string>()
      allPosts.forEach((post: Post) => {
        if (post.owner) {
          users.add(post.owner.toLowerCase())
        }
      })
      setUniqueUsers(users)
    }
  }, [allPosts])

  // Calculate total tips from all posts
  const totalTipsWei = allPosts && Array.isArray(allPosts)
    ? allPosts.reduce((acc: bigint, post: Post) => {
        return acc + (post.totalTips || BigInt(0))
      }, BigInt(0))
    : BigInt(0)

  // Convert to ETH
  const totalValueETH = Number(totalTipsWei) / 1e18
  const totalValueUSD = totalValueETH * ethPrice

  return {
    totalUsers: uniqueUsers.size,
    totalPosts: Number(totalPosts || 0),
    totalValueETH: totalValueETH.toFixed(4),
    totalValueUSD: totalValueUSD.toFixed(2),
    isLoading: isLoadingPosts || isLoadingAllPosts,
  }
}

'use client'
import React from 'react'
import { motion } from 'motion/react'
import { pageVariants } from '@/lib/animations/page-animation'
import TodoScreen from '@/components/todo/TodoScreen'

const TodoPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <TodoScreen />
    </motion.div>
  );
}

export default TodoPage

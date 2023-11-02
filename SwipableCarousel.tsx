import React, { useRef, useState } from 'react'
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  Theme,
  useMediaQuery,
} from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

type GetSlidePositionArgs = {
  isDragging: boolean
  deltaX: number
  activeSlideIndex: number
  isDesktop?: boolean
  isMouseMoving: boolean
}

function getSlidePosition({
  isDragging,
  deltaX,
  activeSlideIndex,
  isMouseMoving,
  isDesktop = false,
}: GetSlidePositionArgs): string {
  const draggingMovement = `translateX(${deltaX}px) translateX(-${
    activeSlideIndex * 100
  }%)`

  const slideMovement = `translateX(-${activeSlideIndex * 100}%)`

  if (isDesktop) {
    if (isDragging && isMouseMoving) {
      return draggingMovement
    }

    return slideMovement
  }

  if (isDragging) {
    return draggingMovement
  }

  return slideMovement
}

const slides = [
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699_2.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-3.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-4.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-5.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-6.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-7.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-8.jpg',
  'https://home.ripley.cl/store/Attachment/WOP/D191/2000395221699/2000395221699-9.jpg',
]

function NewGallery() {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(1)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [deltaX, setDeltaX] = useState<number>(0)
  const totalOfSlides = slides.length
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const slideRef = useRef<HTMLDivElement>(null)

  const onNextSlideClick = () => {
    if (activeSlideIndex !== totalOfSlides - 1) {
      setActiveSlideIndex(activeSlideIndex + 1)
    }
  }

  const onPrevSlideClick = () => {
    if (activeSlideIndex !== 0) {
      setActiveSlideIndex(activeSlideIndex - 1)
    }
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const onMouseUp = () => {
    setIsDragging(false)
    setDeltaX(0)
    setIsMouseMoving(false)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    setIsMouseMoving(true)
    if (slideRef?.current) {
      setDeltaX(e.clientX - startX)
    }
  }

  const onMouseLeave = () => {
    if (!isDragging) return

    if (deltaX > 50 && deltaX !== 0) {
      onPrevSlideClick()
    }
    if (deltaX < 50 && deltaX !== 0) {
      onNextSlideClick()
    }
    setIsDragging(false)
    setIsMouseMoving(false)
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setDeltaX(e.touches[0].clientX - startX)
  }

  const onTouchEnd = () => {
    if (deltaX > 50) {
      onPrevSlideClick()
    } else if (deltaX < -50) {
      onNextSlideClick()
    }
    setIsDragging(false)
  }

  return (
    <Container
      disableGutters
      sx={{
        width: '100%',
        maxWidth: '816px',
        display: 'flex',
        flexDirection: 'column',
        '@media (min-width: 600px)': {
          flexDirection: 'row-reverse',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          alignSelf: 'flex-start',
          '& > button': {
            position: 'absolute',
            zIndex: 1,
            top: '50%',
            transform: 'translateY(-50%)',
          },
        }}
      >
        {isDesktop && (
          <>
            <IconButton
              aria-label="atrás"
              onClick={onPrevSlideClick}
              disabled={activeSlideIndex === 0}
              sx={{ left: 0 }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              aria-label="siguiente"
              onClick={onNextSlideClick}
              disabled={activeSlideIndex === totalOfSlides - 1}
              sx={{ right: 0 }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        <Box
          ref={slideRef}
          sx={{
            display: 'flex',
            width: '100%',
            transform: getSlidePosition({
              isDragging,
              deltaX,
              activeSlideIndex,
              isMouseMoving,
            }),
            transition: isDragging
              ? 'none'
              : 'transform cubic-bezier(0.15, 0.3, 0.25, 1) 0.35s',
            cursor: isDragging ? 'grabbing' : 'grab',
            '& > div': {
              flexShrink: 0,
              width: '100%',
            },
            '@media (min-width: 600px)': {
              transform: getSlidePosition({
                isDragging,
                deltaX,
                activeSlideIndex,
                isMouseMoving,
                isDesktop,
              }),
            },
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((slide, index) => (
            <div key={slide} aria-hidden={index !== activeSlideIndex}>
              <img src={slide} />
            </div>
          ))}
        </Box>
      </Box>
      <List
        disablePadding
        sx={{
          display: 'flex',
          maxWidth: '100%',
          overflow: 'auto',
          padding: '4px 0',
          '&::-webkit-scrollbar': {
            height: 5,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F6F5FB',
            borderRadius: (theme) => theme.shape.borderRadius,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d9d9d9',
            borderRadius: (theme) => theme.shape.borderRadius,
            '&:hover': {
              backgroundColor: '#c3c3c3',
            },
          },
          '@media (min-width: 600px)': {
            flexDirection: 'column',
            width: '86px',
            height: '420px',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: 5,
            },
          },
        }}
      >
        {slides.map((slide, index) => (
          <ListItem
            key={slide}
            disablePadding
            onMouseOver={() => setActiveSlideIndex(index)}
            sx={{
              width: '52px',
              height: '52px',
              margin: '0 2px',
              cursor: 'pointer',
              flexShrink: '0',
              padding: '4px 0',
              border: '1px solid transparent',
              ...(index === activeSlideIndex && {
                border: '1px solid #ccc',
              }),
            }}
          >
            <img src={slide} />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default NewGallery

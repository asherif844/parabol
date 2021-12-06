import React, {useEffect, useRef, useState} from 'react'
import styled from '@emotion/styled'
import {PALETTE} from '../../styles/paletteV3'
import Confetti from '../Confetti'

const Background = styled('div')({
  display: 'flex',
  background: 'radial-gradient(ellipse at center, #45484d 0%, #000000 100%)',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
})

const LOGO_WIDTH = 320
const LOGO_HEIGHT = 320

const Logo = styled('div')({
  left: 0,
  top: 0,
  position: 'absolute'
})

const Label = styled('div')({
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 0,
  fontWeight: 600,
  fontSize: LOGO_WIDTH / 6,
  transform: `translateY(-${LOGO_HEIGHT / 2}px)`
})
const Centroid = styled('div')({})
const colors = [
  [PALETTE.GRAPE_700, PALETTE.TOMATO_500, PALETTE.AQUA_400],
  [PALETTE.GRAPE_700, PALETTE.AQUA_400, PALETTE.TOMATO_500],
  [PALETTE.AQUA_400, PALETTE.GRAPE_700, PALETTE.TOMATO_500],
  [PALETTE.AQUA_400, PALETTE.TOMATO_500, PALETTE.GRAPE_700],
  [PALETTE.TOMATO_500, PALETTE.AQUA_400, PALETTE.GRAPE_700],
  [PALETTE.TOMATO_500, PALETTE.GRAPE_700, PALETTE.AQUA_400],
  [PALETTE.GRAPE_700, PALETTE.GRAPE_700, PALETTE.GRAPE_700],
  [PALETTE.TOMATO_500, PALETTE.TOMATO_500, PALETTE.TOMATO_500],
  [PALETTE.AQUA_400, PALETTE.AQUA_400, PALETTE.AQUA_400]
]

const maxX = window.innerWidth - LOGO_WIDTH
const maxY = window.innerHeight - LOGO_HEIGHT
let dirX = Math.round(Math.random()) * 2 - 1
let dirY = Math.round(Math.random()) * 2 - 1
let curX = Math.floor(Math.random() * maxX)
let curY = Math.floor(Math.random() * maxY)
let palette = colors[Math.floor(Math.random() * colors.length)]!
const speed = 4

const move = (el: HTMLImageElement, onWin: () => void) => {
  const diffX = dirX * speed
  const diffY = dirY * speed
  const nextX = curX + diffX
  const nextY = curY + diffY
  curX = nextX > maxX ? maxX - (nextX - maxX) : nextX < 0 ? -nextX : nextX
  curY = nextY > maxY ? maxY - (nextY - maxY) : nextY < 0 ? -nextY : nextY
  dirX = curX === nextX ? dirX : dirX * -1
  dirY = curY === nextY ? dirY : dirY * -1
  el.style.transform = `translate3d(${curX}px,${curY}px,0)`
  const isChange = curX !== nextX || curY !== nextY
  if (isChange) {
    let nextPalette = palette
    while (nextPalette === palette) {
      nextPalette = colors[Math.floor(Math.random() * colors.length)]!
    }
    palette = nextPalette
    const wings = Array.from((el as any).firstChild.firstChild.children) as SVGPathElement[]
    wings.forEach((wing, idx) => {
      wing.setAttribute('fill', palette[idx]!)
    })
    if (curX !== nextX && curY !== nextY) {
      onWin()
    }
  }

  requestAnimationFrame(() => {
    move(el, onWin)
  })
}

const NotFound = () => {
  const ref = useRef<HTMLImageElement>(null)
  const [active, _setActive] = useState(false)
  const setActive = () => {
    _setActive(true)
    requestAnimationFrame(() => {
      _setActive(false)
    })
  }
  useEffect(() => {
    move(ref.current!, setActive)
  }, [])
  return (
    <Background>
      <Logo ref={ref}>
        <svg
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          viewBox='0 0 31 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='mark-color'>
            <path
              id='Union'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M17.8303 3.32541C17.6044 3.10841 17.3773 2.89441 17.1483 2.69241C17.0023 2.56441 16.8563 2.44141 16.7103 2.31941C16.6626 2.27937 16.6151 2.23814 16.5677 2.19693C16.4919 2.13109 16.4163 2.06529 16.3394 2.00441C19.0144 0.176407 21.5364 -0.328598 23.2504 0.656403C25.0793 1.7124 25.8894 4.37941 25.4753 7.9774C25.4274 8.40041 25.3573 8.83641 25.2744 9.2774C25.2585 9.36237 25.24 9.44771 25.2213 9.53342C25.2095 9.58794 25.1976 9.64259 25.1864 9.6974C25.1223 10.0074 25.0504 10.3224 24.9703 10.6394C24.9293 10.7984 24.8864 10.9604 24.8424 11.1214C24.7554 11.4334 24.6614 11.7494 24.5603 12.0644C24.5419 12.1216 24.5238 12.1789 24.5057 12.2361C24.475 12.3339 24.4442 12.4316 24.4114 12.5294C24.399 12.5637 24.3883 12.5983 24.3776 12.633C24.3673 12.6661 24.3571 12.6992 24.3453 12.7324L24.3403 12.7214C23.8994 11.7384 23.4033 10.7694 22.8604 9.82941C22.3004 8.86041 21.6833 7.94441 21.0414 7.0594C20.964 6.95322 20.8875 6.84586 20.811 6.73859C20.6536 6.51752 20.4963 6.2968 20.3313 6.0874C19.9944 5.6584 19.6514 5.25041 19.3033 4.85541C19.2328 4.77492 19.1614 4.69865 19.0901 4.62234C19.0461 4.57538 19.0022 4.52841 18.9584 4.48041C18.7203 4.22041 18.4834 3.9644 18.2413 3.72141C18.15 3.63007 18.0577 3.54234 17.9656 3.45459C17.9204 3.41168 17.8754 3.36876 17.8303 3.32541ZM13.1766 24.8418C13.3995 25.0548 13.6226 25.2658 13.8486 25.4648C13.9713 25.5741 14.0953 25.6786 14.219 25.7828L14.2926 25.8448C14.3435 25.887 14.394 25.9309 14.4446 25.9749C14.5162 26.0371 14.5879 26.0994 14.6605 26.1568C11.9856 27.9838 9.4646 28.4908 7.74963 27.5038C5.92261 26.4468 5.11255 23.7788 5.52661 20.1828C5.57556 19.7548 5.64563 19.3188 5.72656 18.8788C5.74292 18.7903 5.76196 18.7018 5.78113 18.613C5.79236 18.5604 5.80371 18.5077 5.81458 18.4548C5.87854 18.1468 5.94958 17.8348 6.02856 17.5208C6.0686 17.3618 6.11157 17.2028 6.15552 17.0438C6.24255 16.7278 6.33752 16.4088 6.44055 16.0878C6.46252 16.021 6.48389 15.9537 6.50525 15.8863C6.53064 15.8065 6.55603 15.7265 6.58252 15.6468C6.59338 15.6145 6.60339 15.5827 6.61328 15.5509C6.6261 15.5098 6.63892 15.469 6.65356 15.4278L6.65955 15.4398C7.09863 16.4178 7.59363 17.3858 8.13855 18.3288C8.69153 19.2888 9.31152 20.2088 9.96057 21.1038C10.0376 21.2095 10.1135 21.3163 10.1895 21.4231C10.3463 21.6436 10.5032 21.8642 10.6696 22.0758C11.0066 22.5038 11.3506 22.9128 11.6986 23.3078C11.7637 23.3815 11.8295 23.4519 11.8951 23.5222C11.9445 23.575 11.9937 23.6278 12.0426 23.6818C12.2805 23.9398 12.5176 24.1948 12.7576 24.4378C12.8616 24.5418 12.9662 24.6414 13.0709 24.7411L13.1766 24.8418Z'
              fill={palette[0]}
            />
            <path
              id='Union_2'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M5.95251 7.13997L5.91016 7.1553C5.84338 7.18031 5.77466 7.20386 5.70605 7.22739C5.62378 7.2556 5.54175 7.28377 5.46313 7.3143C5.21716 4.05231 6.03613 1.64531 7.75012 0.656311C8.32715 0.32431 8.99512 0.155304 9.73523 0.155304C11.3431 0.155304 13.2322 0.927307 15.2021 2.3903C15.5442 2.64331 15.8862 2.9223 16.2262 3.2153C16.2957 3.27336 16.3638 3.33502 16.4324 3.39699C16.4724 3.43321 16.5126 3.46953 16.5532 3.50531C16.7871 3.7153 17.0211 3.9313 17.2542 4.1573C17.3732 4.2733 17.4922 4.3923 17.6112 4.51331C17.8402 4.7453 18.0642 4.9843 18.2882 5.2303L18.3984 5.35095C18.4694 5.42824 18.5404 5.50569 18.6102 5.5853C18.6328 5.61124 18.6559 5.63605 18.679 5.66092C18.7048 5.68878 18.7308 5.71671 18.7562 5.74631C18.7522 5.74631 18.7482 5.74631 18.7441 5.7453C16.5762 5.5213 14.3632 5.53931 12.1962 5.7653L11.9951 5.78554C11.6591 5.81917 11.323 5.85278 10.9912 5.9003C10.4512 5.9783 9.92419 6.0713 9.4082 6.1763C9.30383 6.19717 9.20264 6.22086 9.10132 6.24455C9.0426 6.25832 8.98376 6.27208 8.92419 6.28531C8.57812 6.3613 8.23413 6.4393 7.89917 6.5273C7.77637 6.56062 7.65601 6.59608 7.53613 6.63145C7.47253 6.65021 7.40894 6.66893 7.34521 6.6873C7.04919 6.7733 6.75415 6.8613 6.46814 6.95731C6.29358 7.01642 6.12329 7.07809 5.95251 7.13997ZM25.0642 21.014L25.0918 21.0039C25.1548 20.9808 25.2194 20.9588 25.2839 20.9367C25.3702 20.9073 25.4564 20.8779 25.5387 20.8459C25.7848 24.1059 24.9647 26.5129 23.2498 27.5039C21.4208 28.5589 18.6787 27.9079 15.7977 25.7719C15.4537 25.5159 15.1107 25.2349 14.7677 24.9419C14.7031 24.8869 14.6389 24.8285 14.5745 24.7701C14.5383 24.7372 14.5021 24.7043 14.4657 24.6719C14.2228 24.4539 13.9797 24.2299 13.7378 23.9939C13.6238 23.8839 13.5117 23.7709 13.3988 23.6559C13.1658 23.4199 12.9358 23.1759 12.7068 22.9249L12.611 22.8196C12.5376 22.7393 12.4645 22.6591 12.3927 22.5769C12.3717 22.5533 12.3502 22.5304 12.3289 22.5075C12.3004 22.4771 12.2721 22.4468 12.2448 22.4149C12.2488 22.4159 12.2528 22.4159 12.2577 22.4159C14.4108 22.6349 16.6538 22.6179 18.8058 22.3969L19.0614 22.3707C19.3792 22.3384 19.6974 22.306 20.0088 22.2619C20.5468 22.1839 21.0708 22.0909 21.5857 21.9869C21.6963 21.9644 21.8042 21.9392 21.9124 21.9139C21.9772 21.8987 22.0421 21.8835 22.1078 21.8689C22.4408 21.7949 22.7727 21.7199 23.0938 21.6349C23.2311 21.5983 23.3655 21.5587 23.4993 21.5192L23.6677 21.4699C23.9597 21.3849 24.2488 21.2979 24.5298 21.2029C24.7113 21.143 24.8875 21.0786 25.0642 21.014Z'
              fill={palette[1]}
            />
            <path
              id='Union_3'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M4.66943 19.1338C4.65234 19.22 4.63513 19.3063 4.62305 19.3906C1.67505 17.9726 0 16.0586 0 14.0786C0 11.9686 1.90503 9.9326 5.22803 8.49361C5.61902 8.3246 6.03101 8.16661 6.45496 8.01761C6.5459 7.98572 6.63916 7.95567 6.73242 7.9256L6.86499 7.8826C7.16602 7.78461 7.47205 7.68961 7.78503 7.6006C7.94397 7.5556 8.104 7.5126 8.26697 7.47061C8.58606 7.3876 8.91199 7.31061 9.24194 7.2386C9.29285 7.22768 9.34351 7.2164 9.39404 7.20514C9.4917 7.18341 9.58923 7.1617 9.68799 7.14261C9.71887 7.136 9.74915 7.12923 9.7793 7.12248C9.82214 7.11292 9.8645 7.10341 9.90796 7.0946L9.90613 7.09729C9.90442 7.09981 9.90247 7.10271 9.901 7.10561C9.27502 7.97061 8.68506 8.88361 8.13904 9.8286C7.58105 10.7966 7.09595 11.7916 6.64905 12.7926C6.5979 12.9073 6.54565 13.0217 6.49341 13.136C6.37805 13.3884 6.26282 13.6403 6.16101 13.8936C5.95898 14.4006 5.776 14.9026 5.60803 15.4006C5.57446 15.5029 5.54395 15.6037 5.51355 15.7043C5.4939 15.769 5.47437 15.8337 5.45398 15.8986C5.34998 16.2286 5.24805 16.5576 5.16003 16.8826C5.11182 17.06 5.07019 17.2358 5.02844 17.4122L5.01599 17.4646C4.94397 17.7556 4.87598 18.0456 4.81702 18.3326C4.77502 18.5376 4.73999 18.7416 4.70496 18.9456C4.69446 19.0077 4.68188 19.0707 4.66943 19.1338ZM25.8398 11.282C25.7528 11.603 25.6528 11.927 25.5498 12.251C25.5278 12.3207 25.507 12.3899 25.4862 12.4591C25.4559 12.5596 25.4257 12.6601 25.3918 12.762C25.2239 13.259 25.0408 13.76 24.8389 14.265C24.7358 14.5243 24.6185 14.7801 24.5012 15.0363C24.451 15.1457 24.4009 15.2552 24.3518 15.365C23.9038 16.371 23.4178 17.367 22.8618 18.329C22.3179 19.273 21.7258 20.187 21.0978 21.058C21.0958 21.061 21.0939 21.064 21.0908 21.067C21.1279 21.0604 21.1639 21.0522 21.2 21.0441C21.2347 21.0362 21.2694 21.0284 21.3048 21.022C21.3898 21.0045 21.4736 20.9861 21.5574 20.9678C21.6311 20.9516 21.7047 20.9355 21.7788 20.92C22.1038 20.849 22.4229 20.773 22.7368 20.692C22.8969 20.65 23.0548 20.608 23.2118 20.564C23.5288 20.475 23.8378 20.378 24.1418 20.277L24.256 20.2403C24.3503 20.21 24.4449 20.1798 24.5369 20.147C24.9618 19.997 25.3768 19.839 25.7748 19.667C29.0948 18.228 30.9999 16.191 30.9999 14.079C30.9999 12.101 29.3248 10.187 26.3788 8.77C26.3657 8.85768 26.3481 8.94678 26.3306 9.03581C26.3185 9.09706 26.3064 9.15828 26.2958 9.21901C26.2609 9.422 26.2258 9.62401 26.1838 9.82901C26.1259 10.114 26.0579 10.402 25.9868 10.691L25.9565 10.8168C25.9193 10.972 25.8823 11.1261 25.8398 11.282Z'
              fill={palette[2]}
            />
          </g>
        </svg>
        <Label>404</Label>
      </Logo>
      <Centroid>
        <Confetti active={active} />
      </Centroid>
    </Background>
  )
}

export default NotFound

// CarouselExample.jsx
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const CarouselExample = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const items = [
    { id: 1, title: 'Item 1', color: '#f87171' },
    { id: 2, title: 'Item 2', color: '#60a5fa' },
    { id: 3, title: 'Item 3', color: '#34d399' },
    { id: 4, title: 'Item 4', color: '#fbbf24' },
    { id: 5, title: 'Item 5', color: '#c084fc' },
    { id: 6, title: 'Item 6', color: '#f472b6' }
  ];

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      keyBoardControl={true}
      containerClass="carousel-container"
      itemClass="carousel-item-padding-40-px"
      arrows={false}
      showDots={true}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: item.color,
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1.25rem',
            marginBottom: '30px',
            marginLeft: '10px'
          }}
        >
          {item.title}
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselExample;

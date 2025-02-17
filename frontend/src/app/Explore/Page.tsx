import React from 'react'
import Image from 'next/image';

const Explore = () => {
    const Arr = [
        {
            name : "Nainital",
            path : "/images/nainital.jpg",
        },
    ];
  return (
    <div>
      <div>
        <p>Explore Uttaranchal</p>
      </div>
      <div>
        {
            Arr.map(({name , path},id) => (
                <div key={id}>
                    <div>
                        <Image src={path} alt='Loading...' />
                        </div>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Explore

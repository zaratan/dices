import React from 'react';
import Link from 'next/link';

const index = () => (
  <div>
    <ul>
      <li>
        <Link href="/dnd5">
          <a>D&D 5</a>
        </Link>
      </li>
    </ul>
  </div>
);

export default index;

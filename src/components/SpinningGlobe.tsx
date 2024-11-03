import React, { useEffect, useState } from 'react';

const GLOBE_FRAMES = [
  `
     .-""""""-.
   .'          '.
  /   O      O   \\
 :                :
 |    --------    |
 : \\          / :
  \\  '-......-'  /
   '.          .'
     '-......-'
`,
  `
     .-""""""-.
   .'    O     '.
  /              \\
 :                :
 |    --------    |
 :     O          :
  \\  '-......-'  /
   '.          .'
     '-......-'
`,
  `
     .-""""""-.    
   .'          '.
  /              \\
 :       O        :
 |    --------    |
 :                :
  \\      O      /
   '.          .'
     '-......-'
`,
  `
     .-""""""-.
   .'          '.
  /        O     \\
 :                :
 |    --------    |
 :    O           :
  \\             /
   '.          .'
     '-......-'
`,
];

const ASCII_EARTH = `                                    
                                                                     
                                                                    
++++++++++++                            
++++++++++++++++++++++                       
++++++++ +++  ++  +++ ++++++++                   
+++++++   +++   ++   +++   +++++++                 
+++  ++    +++    ++    +++    ++  +++               
++   ++     ++     ++     ++     ++  +++              
+++++++++++++++++++++++++++++++++++++++++        
++++++++++++++++++++++++++++++++++++++++++++         
+++   ++       ++      ++      ++       ++   +++          
++    ++      +++      ++      +++      ++    ++          
++    ++       ++       ++       ++       ++   +++         
++    ++       ++       ++       ++       ++    ++         
++    ++       ++       ++       ++       ++    ++         
++++++++++++++++++++++++++++++++++++++++++++    
++    ++       ++       ++       ++       ++    ++         
++    ++       ++       ++       ++       ++    ++         
+++   ++       ++       ++       ++       ++   +++         
++    ++      +++      ++      +++      ++    ++          
+++   ++       ++      ++      ++       ++   +++          
++++++++++++++++++++++++++++++++++++++++++++     
+++   ++     +++     ++     +++     ++   +++            
+++  ++     ++     ++     ++     ++  +++              
++  +++   +++    ++    ++    +++  ++                
++++++++  +++   ++   +++  ++++++++                 
+++++++ +++  ++  +++ +++++++                    
++++++++++++++++++++++                       
      ++++++++++                             
                                                                           
                                                                                          
                                                     
                                                                                                           
`;

const MATRIX_CHARS = '01';

export const SpinningGlobe: React.FC = () => {
  const [matrix, setMatrix] = useState<string[]>([]);
  const rows = 20;
  const cols = 40;

  useEffect(() => {
    const generateMatrix = () => {
      const newMatrix = [];
      for (let i = 0; i < rows; i++) {
        let row = '';
        for (let j = 0; j < cols; j++) {
          const rand = Math.random();
          if (rand < 0.1) {
            row +=
              MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          } else {
            row += ' ';
          }
        }
        newMatrix.push(row);
      }
      return newMatrix;
    };

    const interval = setInterval(() => {
      setMatrix(generateMatrix());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border-4 border-[#33ff33] p-4 rounded-lg">
      <h2 className="text-[#33ff33] font-mono text-lg mb-4">
        MAKE ML MAKE SENSE
      </h2>
      <div className="relative">
        <pre className="text-[#33ff33] font-mono text-xs leading-none opacity-20 pointer-events-none absolute top-0 left-0 right-0 bottom-0">
          {matrix.join('\n')}
        </pre>
        <pre className="text-[#33ff33] font-mono text-xs leading-none relative z-10">
          {ASCII_EARTH}
        </pre>
      </div>
    </div>
  );
};

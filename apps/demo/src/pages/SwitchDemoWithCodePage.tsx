import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import SwitchDemo from './demo/SwitchDemo';

const SwitchDemoWithCodePage: React.FC = () => {
	const codeString = `import React from 'react';
  import { RadixSwitch } from '@repo/radix-ui/components';
  
  const SwitchDemo: React.FC = () => (
    <div className="py-4 space-y-8">
      <RadixSwitch />
  
      <div>
        <h2 className="text-xl font-semibold mb-2">Size</h2>
        <p className="mb-4 text-gray-600">
          이 컴포넌트는 \`size\` 프로퍼티를 사용하여 크기가 다른 여러 개의
          스피너를 표시합니다.
        </p>
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((_, i) => (
            <RadixSwitch
              key={i}
              defaultChecked
              size={String(i + 1) as '1' | '2' | '3'}
            />
          ))}
        </div>
      </div>
  
      <div>
        <h2 className="text-xl font-semibold mb-2">Color</h2>
        <p className="mb-4 text-gray-600">
          \`color\` prop을 사용해 특정 색상을 지정할 수 있습니다.
        </p>
        <div className="flex items-center gap-4">
          {['indigo', 'cyan', 'orange', 'crimson'].map((value, i) => (
            <RadixSwitch
              key={i}
              defaultChecked
              color={
                value as 'indigo' | 'cyan' | 'orange' | 'crimson'
              }
            />
          ))}
        </div>
      </div>
  
      <div>
        <h2 className="text-xl font-semibold mb-2">Variant</h2>
        <p className="mb-4 text-gray-600">
          \`variant\` prop을 사용해 시각적 스타일을 조절할 수 있습니다.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-3">
            {['surface', 'classic', 'soft'].map((value, i) => (
              <RadixSwitch
                key={i}
                variant={value as 'surface' | 'classic' | 'soft'}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {['surface', 'classic', 'soft'].map((value, i) => (
              <RadixSwitch
                key={i}
                defaultChecked
                variant={value as 'surface' | 'classic' | 'soft'}
              />
            ))}
          </div>
        </div>
      </div>
  
      <div>
        <h2 className="text-xl font-semibold mb-2">Radius</h2>
        <p className="mb-4 text-gray-600">
          \`radius\` prop을 사용해 특정 반경을 지정할 수 있습니다.
        </p>
        <div className="flex items-center gap-4">
          {['none', 'small', 'full'].map((value, i) => (
            <RadixSwitch
              key={i}
              defaultChecked
              radius={value as 'none' | 'small' | 'full'}
            />
          ))}
        </div>
      </div>
  
      <div>
        <h2 className="text-xl font-semibold mb-2">Label</h2>
        <p className="mb-4 text-gray-600">
          \`label\` prop을 사용해 특정 레이블을 지정할 수 있습니다.
        </p>
        <div className="flex flex-col gap-4">
          {['Sync settings', 'Sync settings', 'Sync settings'].map(
            (value, i) => (
              <RadixSwitch
                size={String(i + 1) as '1' | '2' | '3'}
                key={i}
                defaultChecked
                label={value}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
  
  export default SwitchDemo;
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Switch 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					Checkbox의 대체 스위치를 토글합니다.
				</p>

				<PreviewCodeTabs
					preview={<SwitchDemo />}
					code={
						<pre className="bg-gray-200 p-4 text-sm rounded overflow-x-auto whitespace-pre-wrap">
							{codeString}
						</pre>
					}
				/>
			</div>
		</div>
	);
};

export default SwitchDemoWithCodePage;

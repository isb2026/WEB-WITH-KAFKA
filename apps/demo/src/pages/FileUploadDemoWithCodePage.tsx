import React from 'react';
import { PreviewCodeTabs } from '../components/PreviewCodeTabs';
import FileUploadDemo from './demo/FileUploadDemo';

const FileUploadDemoWithCodePage: React.FC = () => {
	const codeString =
		`import { RadixFileUpload } from '@repo/radix-ui/components';
  import React from 'react';
  
  const FileUploadDemo: React.FC = () => (
    // Standalone usage
    <div className="py-2 space-y-8">
      <RadixFileUpload
        className="custom-uploader"
        maxFiles={3}
        maxSize={10 * 1024 * 1024}
        accept="image/*,.pdf, .csv, .xls, xlsx"
        onValueChange={(files) => console.log('Files:', files)}
        onFileReject={(file, message) =>
          console.error(message, { description: file.name })
        }
      />
    </div>
  );
  
  export default FileUploadDemo;
  `.trim();

	return (
		<div className="min-h-screen w-full bg-gray-50 px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					File Upload 컴포넌트 예제
				</h1>
				<p className="text-sm text-gray-500 mb-6">
					드래그 앤 드롭, 미리보기, 진행 상황 추적 기능을 갖춘 파일
					업로드 구성 요소입니다.
				</p>

				<PreviewCodeTabs
					preview={<FileUploadDemo />}
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

export default FileUploadDemoWithCodePage;

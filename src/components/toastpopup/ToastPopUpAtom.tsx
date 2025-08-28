import React, { useEffect } from 'react';
//import { Button } from '../../blocks/button/ButtonAtom';
import { Div } from '../../blocks/div/DivAtom';
import { Container } from '../../blocks/container/ContainerAtom';
import './toast.scss';
import { ToastHeader } from './toastHeader';

const variants = {
	primary: 'primary',
	secondary: 'secondary',
	all: 'all',
	none: 'none',
};

interface ConfirmationAtomProps {
	onClick?: () => void;
	onClose?: () => void;
	width?: string;
	height?: string;
	timeout: number;
	isLoading?: boolean;
	buttonType?: string;
	description?: string;
	message?: string;
	variant?: keyof typeof variants;
	type?: string;
	setShowToast?: any;
	crossicon?: boolean;
	hideToast?: (() => void | undefined) | undefined;
}

export const ToastContainerAtom: React.FC<ConfirmationAtomProps> = ({ width, timeout, description, message, type = 'info', setShowToast, crossicon = true, hideToast }) => {
	let bgcolor: any = '';
	let color: any = '';
	let typeClass: string = '';

	// const [showToast, setShowToast] = useState<boolean>(true);

	switch (type) {
		case 'success':
			bgcolor = '#EBF4EC';
			color = 'success';
			typeClass = 'popup-container-confirm';
			break;
		case 'warning':
			bgcolor = '#FDF0E3';
			color = 'orange';
			typeClass = 'popup-container-confirm';
			break;
		case 'error':
			bgcolor = '#FAEAEA';
			color = 'redAlert';
			typeClass = 'popup-container-confirm';
			break;
		case 'info':
			bgcolor = '#E8F4FD';
			color = 'blue';
			typeClass = 'popup-container-confirm';
			break;

		default:
			break;
	}

	useEffect(() => {
		setTimeout(() => {
			if (hideToast) {
				hideToast();
			}
			setShowToast(false);
		}, timeout);
	}, []);

	const handleRemove = () => {
		setShowToast(false);
		if (hideToast) {
			hideToast();
		}
	};

	return (
		<>
			{
				<Div className={typeClass}>
					<Container minHeight='15rem' backgroundColor={bgcolor} className='popup-content-confirm' width={width}>
						<ToastHeader onClose={handleRemove} toastMessage={message} textcolor={color} type={type} cross={crossicon} toastdescription={description} />
					</Container>
				</Div>
			}
		</>
	);
};

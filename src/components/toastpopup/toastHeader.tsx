import React, { useRef, useEffect } from 'react';
import './toastHeader.scss';
import glyph from '../../assets/toast/Glyph.svg';
import { errorcrossicon } from '../../assets/toast/index';
import { warningcrossicon } from '../../assets/toast/index';
import { successcrossicon } from '../../assets/toast/index';
import { Div } from '../../blocks/div/DivAtom';
import { Typography } from '../../blocks/typography/TypographyAtom';
import { erroricon, warningicon, successicon, infoicon } from '../../assets/toast/index';

interface ToastHeaderProps {
	onClose?: () => void;
	id?: any;
	type?: string;
	toastMessage: string | undefined;
	textcolor?: 'blue' | 'primary' | undefined;
	toastdescription?: string;
	cross?: boolean;
}

export const ToastHeader: React.FC<ToastHeaderProps> = ({ onClose, toastMessage, toastdescription, cross, textcolor, type = 'success' }) => {
	const modalRef = useRef<HTMLDivElement>(null);
	let img: any = '';
	let icon: any = '';
	switch (type) {
		case 'info':
			img = `${glyph}`;
			icon = `${infoicon}`;
			break;
		case 'warning':
			img = `${warningcrossicon}`;
			icon = `${warningicon}`;
			break;
		case 'error':
			img = `${errorcrossicon}`;
			icon = `${erroricon}`;
			break;
		case 'success':
			img = `${successcrossicon}`;
			icon = `${successicon}`;
			break;

		default:
			break;
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose && onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	return (
		<Div grid-1>
			<div className='modal-header'>
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<img src={icon} alt='icon' />
					<Typography
						label={
							<div>
								<span className='popup-heading'>{`${toastMessage} - `}</span>
								{toastdescription && <span className='popup-description'>{`${toastdescription} `}</span>}
							</div>
						}
						className=''
						textColor={textcolor}
						fontSize='fontSize14'
						fontWeight='bold'
					/>
					{cross && <img onClick={onClose} src={img} alt='crossIcon' className='cros-btn' />}
				</div>
			</div>
		</Div>
	);
};

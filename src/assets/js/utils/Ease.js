import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);
CustomEase.create('gleasing', '0.4, 0, 0, 1');

const sineOut = gsap.parseEase('sine.out');
const sineIn = gsap.parseEase('sine.in');
const sineInOut = gsap.parseEase('sine.inOut');
const expoIn = gsap.parseEase('expo.in');
const expoOut = gsap.parseEase('expo.out');
const expoInOut = gsap.parseEase('expo.inOut');
const quintInOut = gsap.parseEase('quint.inOut');
const gleasing = gsap.parseEase('gleasing');
const backOut = gsap.parseEase('back.out(1.6)');

const Ease = {
	sineOut,
	sineIn,
	sineInOut,
	expoIn,
	expoOut,
	quintInOut,
	gleasing,
	backOut,

	DoubleSineOut: (i) => {
		return sineOut(sineOut(i));
	},

	DoubleSineIn: (i) => {
		return sineIn(sineIn(i));
	},

	MixEaseIn: (i) => {
		return expoIn(sineIn(i));
	},

	ExpoMix: (i) => {
		const t = expoInOut(i);
		return expoIn(i) * (1 - t) + expoOut(i) * t;
	},

	DoubleExpoInOut: (i) => {
		return expoIn(expoOut(i));
	},

	SineIntoOut: (i) => {
		return sineIn(sineOut(i));
	},

	SineMix: (i) => {
		const t = sineInOut(i);
		return sineIn(i) * (1 - t) + sineOut(i) * t;
	},

	ExpoSineOut: (i) => {
		return expoOut(sineOut(i));
	},

	SineInExpoOut: (i) => {
		const t = expoInOut(i);
		return sineIn(i) * (1 - t) + expoOut(i) * t;
	},

	SineInBackOut: (i) => {
		const t = sineInOut(i);
		return sineIn(i) * (1 - t) + backOut(i) * t;
	},

	SineOutBackOut: (i) => {
		return sineOut(backOut(i));
	},
};

export default Ease;

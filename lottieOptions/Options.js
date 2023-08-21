import Male from "../lotties/male.json";
import Chat2 from "../lotties/chat2.json";
import Female from "../lotties/female.json";
import Other from "../lotties/trans.json";
import NoData from "../lotties/noData.json";
import Loader from "../lotties/loading.json";

export const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: Chat2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const maleOptions = {
  loop: true,
  autoplay: true,
  animationData: Male,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const femaleOptions = {
  loop: true,
  autoplay: true,
  animationData: Female,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
export const otherOptions = {
  loop: true,
  autoplay: true,
  animationData: Other,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const noDataOptions = {
  loop: true,
  autoplay: true,
  animationData: NoData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const loaderOptions = {
  loop: true,
  autoplay: true,
  animationData: Loader,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

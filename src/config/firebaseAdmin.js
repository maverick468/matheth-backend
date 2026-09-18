import admin from 'firebase-admin';

const serviceAccount = {
  type: "service_account",
  project_id: "matheth-dfdc4",
  private_key_id: "2d1e311ffb6f3dd22b00b08eb5a4506469af67e4",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYo517foGJjITU\neu1P7035x+x3MWe1XBoW9KcR2peVNiQ+78/kat+nJ7CwAw6M1dOQDPi49embGCjm\nLSFvAVSRda4nVtciL79QZGRFUx/GCupmpnn84InxDBRwl0Z4IT2l8hU/8ai5qIuz\nrGxxlELo8VwM5yqNfhpwdEhDOHI1jGX3aZ0/12LLEl2OcatfKVSUYNiqlILj4N40\n2bRoY438CYqWPnHkGMXH0lvpCOZz0DW+wgnBHsTuxnkaLgA4zIv1SQH/zb+ToCIA\n5P+IQLRiDzuWQiQxUJjmA8dr6NQUG8i7HknI/0+8uoon/vXdyZOw2EQQmb4PSw6S\nhHwZCYj/AgMBAAECggEAHBCpWhWOl83gdnkLvVDQ04Zw8hGBchU3LtVZCq1YhbTo\nnwTGy1drYuJFRqWtGd5qxRaE88jU0+LFeg8P0i8aA2CX9GXqcH8sLsCplTWHVS8Ki\nCrG9aEOY2VtRPspxyJDEFwkF4zX5wfk9hpHDdra9/rqyJCU068Mt9VNMHh/4z+Nx\n/czGAs2elBvP9T93oKW1uF1V6797YepfH8BM3x4qIKffDqd5RguPnsIWt0TnxSnA\nK8CHr9rZG/xO7Be0niPZjbqbXwmQxFi2Slo2WWupS5otmRJ76NsZtz+AVgBPqkvC\nV4epvxTIHctLnwA0523i0mS46bVKGifcu3RQdAKcMQKBgQDKVafVNJYYMVIdD2DD\ntbZlgb8prYqhwc70T6pPdrzRBkR/4JBaJFJU720b93TztCCnGTkiStXfbt1+wR6G\nC6TrOFrd6vtc6+1UQMy5XIoCpdL+7Mg13pffDJkT/OOr/rBdzt1XK8iBN5k8i2rj\nKOVz0XpZj9z/4kKbdh3e57bEqwKBgQDBH64R/CL3igWCNI0rIgxw62QnCoU+ywOS\nk5Mlj9F0y5PYTkqgR0yhUbWmvV3Ae2pFUfFbBpFywovSRYtcpj2EPIXu2XGkAYhX\n0azCrFRbqr2ihoxO36NiUDEi5QAFvTkubsgfYeMpZKNVd0azlH9KkZP6QeQMwEKk\nPrPrqgOE/QKBgDQ0J2pV+Afj6ci/p/q2zomgET9inCsiAxB74XhBLXRMxq2rtfLb\n/jYV1DPsA8vBBM+4LUqQvl+4jgNfNk3lgTaDQsaREyulX4Vmdqu4mY8XU7ocQ4fK\nl6qf6HsEu4Ur4DtD3U3ZaREV1D6PxhM4AQOB36xt9to6eW786bYSWNCjAoGAW/CZ\Djba7r3moXYjPsWW5qspoux/QsWjjcRz6Q3uyYuhdvjOzj8jXClqMVc1qs0Waqn4\nHT2jQN8dcZ1qG1GJN8sYd/1M/Kc+IZDQjl08S+edICKt6V7OiZ9jxRkASbsr3c8f\nttEDNFGU8Ls4DYZEk1t690knKGrfTxHdIfRueIECgYAc2mRelw1sRJvz+qJOrplg\nFrrwL9PKHQzpnCjzPw82qqkDdQuR9MgGyLPDKCn/ErQmT4bl5GvzhKzxQVyLR75V\nbQ/rOrsirwC7Wl4xpuFPLEXVZXXBJbHngFK7kPUvC9g43O56wfXf5nBf2h7tzOHi\npk7PoswVoi+GnXwfigamJg==\n-----END PRIVATE KEY-----",
  client_email: "firebase-adminsdk-fbsvc@matheth-dfdc4.iam.gserviceaccount.com",
  client_id: "114545170232103753501",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40matheth-dfdc4.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
export default admin;
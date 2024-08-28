const { MOCK_PORTAL_QUEUE } = require('./test/unit/portal-queue-mock');

function makeExternalApi({ request, url }) {
  async function getLatestDrop() {
    let dropList = {};
    try {
      await request.get(`${url}/dropsInProduct/.json/?products=ENM`).then((dropData) => {
        dropList = dropData.body;
      });
      return dropList.Drops[0].split(':')[1];
    } catch (err) {
      throw new Error(`Unable to get latest drop version, ${err}`);
    }
  }

  async function getLatestGreenProductSetVersion() {
    let latestGreenProductSetVersion;
    try {
      await request.get(`${url}/getLastGoodProductSetVersion/?productSet=ENM`).then((productSetData) => {
        latestGreenProductSetVersion = productSetData.text;
      });
      return latestGreenProductSetVersion;
    } catch (err) {
      throw new Error(`Unable to get latest green product set version, ${err}`);
    }
  }

  async function getLatestEnmIsoVersion(drop) {
    let latestEnmIsoVersion;
    try {
      await request.get(`${url}/getlatestisover/?drop=${drop}&product=ENM`).then((enmIsoVersionData) => {
        latestEnmIsoVersion = enmIsoVersionData.text;
      });
      if (latestEnmIsoVersion === 'None') {
        throw new Error('ENM ISO version is None');
      }
      return latestEnmIsoVersion;
    } catch (err) {
      throw new Error(`Unable to get latest ENM ISO version, ${err}`);
    }
  }

  async function getProductSetContentVersion(artifact, productSetVersion) {
    let productSetContentVersion;

    if (!artifact) {
      throw new Error('You must supply an artifact name');
    }

    if (!productSetVersion) {
      throw new Error('You must supply a product set version');
    }

    try {
      await request.get(`${url}/api/productSet/ENM/AOM901151/${productSetVersion}/?format=json`).then((productSetContentData) => {
        for (const productSetContent of productSetContentData.body) {
          if (productSetContent.artifact === artifact) {
            productSetContentVersion = productSetContent.version;
          }
        }
      });

      if (!productSetContentVersion) {
        throw new Error('productSetContentversion is empty');
      }

      return productSetContentVersion;
    } catch (err) {
      throw new Error(`Unable to get artifact ${artifact} version, ${err}`);
    }
  }

  async function getPackagesInEnmIso(enmIsoVersion) {
    let enmPackages;

    if (!enmIsoVersion) {
      throw new Error('You must supply an ENM ISO version when getting packages in an ENM ISO');
    }

    try {
      await request.get(
        `${url}/getPackagesInISO/?isoName=ERICenm_CXP9027091&isoVersion=${enmIsoVersion}&useLocalNexus=true`,
      ).then((enmContentData) => {
        enmPackages = enmContentData.body.PackagesInISO;
      });

      if (!enmPackages) {
        throw new Error(`No ENM ISO packages found for ENM ISO '${enmIsoVersion}'`);
      }

      return enmPackages;
    } catch (err) {
      throw new Error(`Unable to get ENM ISO packages for ENM ISO '${enmIsoVersion}', ${err}`);
    }
  }

  async function getPackagesInEnmTestwareIso(enmIsoVersion) {
    let enmTestwarePackages;
    let enmTestwareVersions;
    let latestEnmTestwareVersion;

    if (!enmIsoVersion) {
      throw new Error('You must supply an ENM ISO version when getting packages in an ENM testware ISO');
    }

    try {
      await request.get(
        `${url}/api/getProductwareToTestwareMediaMapping/mediaArtifact/ERICenm_CXP9027091/version/${enmIsoVersion}/?format=json&pretty=true`,
      )
        .then((enmTestwareVersionData) => {
          enmTestwareVersions = enmTestwareVersionData.body.testwareMediaArtifactVersions;
        });

      latestEnmTestwareVersion = enmTestwareVersions.pop();

      if (!latestEnmTestwareVersion) {
        throw new Error(`No ENM testware ISO version found for ENM ISO '${enmIsoVersion}'`);
      }
    } catch (err) {
      throw new Error(`Unable to get ENM testware ISO version for ENM ISO '${enmIsoVersion}', ${err}`);
    }
    try {
      await request.get(
        `${url}/getPackagesInISO/?isoName=ERICenmtestware_CXP9027746&isoVersion=${latestEnmTestwareVersion}&useLocalNexus=true&showTestware=true`,
      )
        .then((enmContentData) => {
          enmTestwarePackages = enmContentData.body.PackagesInISO;
        });

      if (!enmTestwarePackages) {
        throw new Error(`No ENM Testware ISO packages found for Testware ISO '${latestEnmTestwareVersion}'`);
      }

      return enmTestwarePackages;
    } catch (err) {
      throw new Error(`Unable to get ENM Testware ISO packages for Testware ISO '${latestEnmTestwareVersion}', ${err}`);
    }
  }

  async function getQueuedDeliveryGroups(latestDrop) {
    let queuedDeliveryGroups;

    if (!latestDrop) {
      throw new Error('You must supply a valid drop');
    }
    if (process.env.NODE_ENV === 'TEST' || process.env.NODE_ENV === 'TEST_LOCAL_MONGO') {
      console.log('Running in test mode. Returning mock data.');
      return MOCK_PORTAL_QUEUE;
    }
    try {
      await request.get(`${url}/api/product/ENM/drop/${latestDrop}/deliveryqueue/queued/`).then((deliveryGroups) => {
        queuedDeliveryGroups = deliveryGroups;
      });
      return JSON.parse(queuedDeliveryGroups.text);
    } catch (err) {
      throw new Error(`Unable to get delivery groups from the queue, ${err}`);
    }
  }

  async function deliverDeliveryGroup(deliveryGroupId) {
    if (process.env.NODE_ENV === 'PROD') {
      try {
        await request.post(`${url}/api/autoCreatedGroupDeliver/?format=json`)
          .set('Content-Type', 'application/json')
          .send({ group_id: deliveryGroupId, user: 'AMTUSER' });
      } catch (deliveryGroupError) {
        return {
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 500,
          body: {
            response: `Error: Delivery Group ${deliveryGroupId} has not been delivered: ${deliveryGroupError}`,
          },
        };
      }
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: {
          response: `Delivery Group ${deliveryGroupId} has been delivered`,
        },
      };
    }
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: {
        response: `DEV: Delivery Group ${deliveryGroupId} has been delivered`,
      },
    };
  }

  async function obsoleteDeliveryGroup(drop, deliveryGroupId) {
    const obsoletionDeliveryGroupUrl = `${url}/api/forceOption/True/product/ENM/drop/${drop}/obsoleteGroup/${deliveryGroupId}/`;
    if (process.env.NODE_ENV === 'PROD') {
      try {
        await request.post(obsoletionDeliveryGroupUrl)
          .type('form')
          .send({ user: 'AMTUSER' });
      } catch (obsoleteDeliveryGroupError) {
        return {
          headers: {
            'Content-Type': 'application/json',
          },
          statusCode: 500,
          body: {
            response: `Unable to obsolete Delivery Group: ${obsoleteDeliveryGroupError}`,
          },
        };
      }
    }
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      body: {
        response: `Delivery Group ${deliveryGroupId} has been obsoleted`,
      },
    };
  }

  async function getDeploymentDescription(environment) {
    let deploymentDescription;
    try {
      await request.get(`${url}/api/deployment/deploymentDescription/${environment}/`).then((deploymentDescriptionData) => {
        deploymentDescription = JSON.parse(deploymentDescriptionData.text);
      });
      if (!deploymentDescription.deployment_description_data.name) {
        throw new Error(`No deployment description name found for ${environment}`);
      }
      return deploymentDescription.deployment_description_data.name;
    } catch (err) {
      throw new Error(`Unable to get deployment description, ${err}`);
    }
  }

  return Object.freeze({
    getLatestDrop,
    getLatestGreenProductSetVersion,
    getLatestEnmIsoVersion,
    getProductSetContentVersion,
    getPackagesInEnmIso,
    getPackagesInEnmTestwareIso,
    getQueuedDeliveryGroups,
    deliverDeliveryGroup,
    obsoleteDeliveryGroup,
    getDeploymentDescription,
  });
}

module.exports = { makeExternalApi };

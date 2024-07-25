export const listOfDealStatus = [
  'dealStartDate',
  'proposalDate',
  'loiExecuteDate',
  'leaseSignedDate',
  'noticeToProceedDate',
  'commercialOperationDate',
  'potentialCommissionDate',
];

export const listOfMilestones = [
  'Deal Start',
  'Proposal',
  'LOI Execution',
  'Lease Signed',
  'Notice To Proceed',
  'Commercial Operation',
  'Potential Commission',
];

export const mailTemplates = {
  deals: {
    new: './newDeal',
    update: './deals',
    delete: './deals',
  }
}

export const mailSubject = {
  deals: {
    started: 'Deal Has Been Created',
    updated: 'Current Status of the Deal',
    completed: 'Deal Has Been Completed',
    deleted: 'Deal Has Been Deleted'
  }
}

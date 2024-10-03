export const listOfDealStatus = {
  1: 'dealStartDate',
  2: 'proposalDate',
  3: 'loiExecuteDate',
  4: 'leaseSignedDate',
  5: 'noticeToProceedDate',
  6: 'commercialOperationDate',
  7: 'finalCommissionDate',
}

export const listOfMilestones = {
  1: 'Deal Start',
  2: 'Proposal',
  3: 'LOI Execution',
  4: 'Lease Signed',
  5: 'Notice To Proceed',
  6: 'Commercial Operation',
  7: 'Final Commission',
};

export const mailTemplates = {
  deals: {
    new: './new-deal',
    update: './update-deal',
  }
}

export const mailSubject = {
  deals: {
    started: 'New Tandem Solar Deal Has Been Created',
    updated: 'Tandem Solar New Milestone Achieved!',
    completed: 'Tandem Solar New Milestone Achieved!',
  }
}
